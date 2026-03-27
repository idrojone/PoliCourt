import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { randomUUID } from 'crypto';

export type MonitorRequestDocument = MonitorRequest & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Record<string, any>) => {
      if (ret) {
        delete ret.id;
        delete ret.__v;
        delete ret._id;
        delete ret.updatedAt;
      }
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: Record<string, any>) => {
      if (ret) {
        delete ret.id;
        delete ret.__v;
        delete ret._id;
        delete ret.updatedAt;
      }
      return ret;
    },
  },
})
export class MonitorRequest {
    @Prop({ required: true, unique: true, default: () => randomUUID() })
    uuid!: string;

    @Prop({ required: true })
    email!: string;

    @Prop({ required: true })
    description!: string;

    @Prop({ type: [String], required: true })
    documents!: string[];

    @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
    status!: string;
}

export const MonitorRequestSchema = SchemaFactory.createForClass(MonitorRequest);