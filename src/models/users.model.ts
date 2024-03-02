import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { model, Document } from 'mongoose';
export interface Users extends Document{
    name: string;
    email: string;
    password: string;
    status: string;
}

@Schema({ timestamps:true })
export class SchemaData{
    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true, unique: true, index: true })
    email: string;

    @Prop({ required: true })
    password: string;
    // 1: pending, 2: approved, 3: banned
    @Prop({ default: "1"})
    status: string

}

export const UsersSchema = SchemaFactory.createForClass(SchemaData);

export const UsersModel = model<Users>('User', UsersSchema);