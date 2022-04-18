import DiscordJS, {Intents} from "discord.js";
import dotenv from 'dotenv'
dotenv.config()
const client = new DiscordJS.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

client.on('ready', () => {
    const guildId = process.env.GUILD_ID
    //const guild = client.guilds.cache.get(guildId)
    const guild = false
    let commands

    if(guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands = client.application?.commands

    commands?.create({
        name: 'question',
        description: 'Gets a random multiple choice question from the Quiz Database and awaits your response',
    },{
        name: 'stats',
        description: 'Gets Quiz Server statistics',
    })
})

client.login(process.env.TOKEN)

