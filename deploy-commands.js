import DiscordJS, {Intents} from "discord.js";
import dotenv from 'dotenv'
dotenv.config()
const client = new DiscordJS.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

client.on('ready', () => {
    const guildId = 941318945024139295
    const guild = 941318945024139295
    //const guild = false
    let commands

    if(guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands = guild.commands

    commands?.create({
        name: 'question',
        description: 'Gets a random multiple choice question from the Quiz Database and awaits your response',
    },{
        name: 'stats',
        description: 'Gets Quiz Server statistics',
    },{
        name: 'card',
        description: 'View a bingo card via ID',
        options: {
            name: 'code',
            type: 'STRING',
            description: "Insert the bingo card's code. This can usually be found on the top right of the bingo card",
            required: true
        }
    })
})

client.login(process.env.TOKEN)

