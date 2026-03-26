import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type MonitorRequestDocument = MonitorRequest & Document;

@Schema({ timestamps: true })
export class MonitorRequest {
    @Prop({ required: true })
    username!: string;

    @Prop({ required: true })
    description!: string;

    @Prop({ type: [String], required: true })
    documents!: string[];

    @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
    status!: string;
}

export const MonitorRequestSchema = SchemaFactory.createForClass(MonitorRequest);