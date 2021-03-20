import { prop, getModelForClass } from '@typegoose/typegoose';

export class Guild {
    @prop({required: true, unique: true})
    public guildId: string;

    @prop()
    public prefix: string;
}

export const GuildModel = getModelForClass(Guild);