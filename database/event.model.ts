import { Schema, model, models, Document } from 'mongoose'

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string
  slug: string
  description: string
  overview: string
  image: string
  venue: string
  location: string
  date: string
  time: string
  mode: string
  audience: string
  agenda: string[]
  organizer: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'O título é obrigatório'],
      trim: true,
      maxlength: [100, 'O título não pode exceder 100 caracteres'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A descrição é obrigatória'],
      trim: true,
      maxlength: [1000, 'A descrição não pode exceder 1.000 caracteres'],
    },
    overview: {
      type: String,
      required: [true, 'A visão geral é obrigatória'],
      trim: true,
      maxlength: [500, 'A visão geral não pode exceder 500 caracteres'],
    },
    image: {
      type: String,
      required: [true, 'O URL da imagem é obrigatório'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'O local é obrigatório'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'A localização é obrigatória'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'A data é obrigatória'],
    },
    time: {
      type: String,
      required: [true, 'O tempo é necessário'],
    },
    mode: {
      type: String,
      required: [true, 'O modo é obrigatório'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'O modo deve ser online, offline ou híbrido',
      },
    },
    audience: {
      type: String,
      required: [true, 'O público é obrigatório'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'A agenda é obrigatória'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Pelo menos um item da agenda é obrigatório',
      },
    },
    organizer: {
      type: String,
      required: [true, 'O organizador é obrigatório'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'As tags são obrigatórias'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'Pelo menos uma tag é obrigatória',
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  },
)

// Pre-save hook for slug generation and data normalization
EventSchema.pre('save', function (next) {
  const event = this as IEvent

  // Generate slug only if title changed or document is new
  if (event.isModified('title') || event.isNew) {
    event.slug = generateSlug(event.title)
  }

  // Normalize date to ISO format if it's not already
  if (event.isModified('date')) {
    event.date = normalizeDate(event.date)
  }

  // Normalize time format (HH:MM)
  if (event.isModified('time')) {
    event.time = normalizeTime(event.time)
  }

  next()
})

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Helper function to normalize date to ISO format
function normalizeDate(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format')
  }
  return date.toISOString().split('T')[0] // Return YYYY-MM-DD format
}

// Helper function to normalize time format
function normalizeTime(timeString: string): string {
  // Handle various time formats and convert to HH:MM (24-hour format)
  const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i
  const match = timeString.trim().match(timeRegex)

  if (!match) {
    throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM')
  }

  let hours = parseInt(match[1])
  const minutes = match[2]
  const period = match[4]?.toUpperCase()

  if (period) {
    // Convert 12-hour to 24-hour format
    if (period === 'PM' && hours !== 12) hours += 12
    if (period === 'AM' && hours === 12) hours = 0
  }

  if (
    hours < 0 ||
    hours > 23 ||
    parseInt(minutes) < 0 ||
    parseInt(minutes) > 59
  ) {
    throw new Error('Invalid time values')
  }

  return `${hours.toString().padStart(2, '0')}:${minutes}`
}

// Create unique index on slug for better performance
EventSchema.index({ slug: 1 }, { unique: true })

// Create compound index for common queries
EventSchema.index({ date: 1, mode: 1 })

const Event = models.Event || model<IEvent>('Event', EventSchema)

export default Event
