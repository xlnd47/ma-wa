import { prop, getModelForClass } from '@typegoose/typegoose';
import * as mongoose from 'mongoose';

export class Guild {
    @prop()
    public guildId: string;

    @prop()
    public prefix: string;
}

export const GuildModel = getModelForClass(Guild);