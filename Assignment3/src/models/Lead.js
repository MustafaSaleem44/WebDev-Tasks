import mongoose, { Schema } from 'mongoose';

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    propertyInterest: { type: String, required: true },
    budget: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['New', 'Assigned', 'In Progress', 'Closed'], 
      default: 'New' 
    },
    notes: { type: String, default: '' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    score: { 
      type: String, 
      enum: ['High', 'Medium', 'Low'],
      default: 'Low'
    },
    followUpDate: { type: Date }
  },
  { timestamps: true }
);

// Lead Scoring System Middleware
LeadSchema.pre('save', async function () {
  if (this.isModified('budget') || this.isNew) {
    if (this.budget > 20000000) { // > 20M
      this.score = 'High';
    } else if (this.budget >= 10000000 && this.budget <= 20000000) { // 10M - 20M
      this.score = 'Medium';
    } else { // < 10M
      this.score = 'Low';
    }
  }
});

export const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
