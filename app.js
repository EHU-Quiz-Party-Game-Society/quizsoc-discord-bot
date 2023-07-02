import DiscordJS, {Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu} from 'discord.js'
import dotenv from 'dotenv'
import {
    fetchRandomQuestion,
    fetchQuestion,
    getStatistics,
    createButtonRow,
    replyWithFeedback,
    addCallToActionTryAgain
} from './functions.js'
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
dotenv.config()

Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});

const client = new DiscordJS.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

client.on('ready', () => {
    console.log('Quiz Client: JS Bot Ready')
    console.log('This bot is a member of the following servers:')
    const Guilds = client.guilds.cache.map(guild => "Guild ID: " + guild.id + ". Guild name: " + guild.name);
    console.log(Guilds);
})

client.on('interactionCreate', async (interaction) => {
    const { commandName } = interaction;
    if (interaction.isCommand() || interaction.customId === 'requestNewQuestion') {
        if(commandName === 'question' || interaction.customId === 'requestNewQuestion') {
            let data = await fetchRandomQuestion(interaction);

            try {
                const categories = data.category.map(category => category.name);

                const questionEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(data.question)
                    .setAuthor({name: 'EHU Quiz & Party Game Question Bank', url: 'https://ehuquizsociety.com'})
                    .setDescription('')
                    .addField('Categories: ', categories.join(', '), true)
                    //.setTimestamp()
                    .setFooter({text: 'Question ID: ' + data.id});

                //Log the info into the console for debugging purposes
                console.info(interaction.user.username + " has requested question " + data.id + " in server " + interaction.guild.name)

                interaction.reply({
                    embeds: [questionEmbed],
                    components: [createButtonRow(interaction, data)]
                })

            } catch(e) {
                interaction.reply({
                    content: "Looks like the API isn't reachable at the moment! Please try again later...",
                })
                console.log("Unable to reach API. Error: " + e)
                Sentry.captureException(e, {
                    user: {
                        id: interaction.user.id,
                        username: interaction.user.username
                    },
                    level: 'fatal'
                })
            }
        } else if(commandName === 'stats') {
            let stats = await getStatistics();
            try {
                let easyRead = JSON.stringify(stats, null, 2)
                    .replaceAll('"', "**")
                    .replaceAll('{', "")
                    .replaceAll('}', "");

                interaction.reply({content: easyRead})
            } catch(e) {
                interaction.reply({
                    content: "Looks like the API isn't reachable at the moment! Please try again later...",
                })
                console.error("Unable to reach API")
                Sentry.captureException(e, {
                    user: {
                        id: interaction.user.id,
                        username: interaction.user.username
                    },
                    level: 'fatal'
                })
            }
        }
        else if(commandName === 'card') {
            const code = interaction.options.getString('code');
            try {
                interaction.reply({
                    content: "https://ehuquizsociety.com/bingo/card/" + code,
                })
            } catch(e) {
                interaction.reply({
                    content: "Looks like the API isn't reachable at the moment! Please try again later...",
                })
                console.error("Unable to reach API")
                Sentry.captureException(e, {
                    user: {
                        id: interaction.user.id,
                        username: interaction.user.username
                    },
                    level: 'fatal'
                })
            }
        }
        else if(commandName === 'sheet') {
            const code = interaction.options.getString('sheet');
            try {
                interaction.reply({
                    content: "https://ehuquizsociety.com/bingo/sheet/" + code,
                })
            } catch(e) {
                interaction.reply({
                    content: "Looks like the API isn't reachable at the moment! Please try again later...",
                })
                console.error("Unable to reach API")
                Sentry.captureException(e, {
                    user: {
                        id: interaction.user.id,
                        username: interaction.user.username
                    },
                    level: 'fatal'
                })
            }
        }
    }

    if (interaction.isSelectMenu() || interaction.isButton()) {
        let questionID = interaction.customId.match(/\d+/g);
        let data = await fetchQuestion(interaction, questionID);
        let customId = interaction.customId.replace(/[0-9]/g,'');
        let array = ['A','B','C','D'];

        //Log information into console for debugging
        console.info(interaction.user.username + " has interacted with question " + data.id + " in server " + interaction.guild.name)

        if (array.includes(customId)) {
            const incorrectEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle("Incorrect")
                .setDescription("That wasn't right! You chose: " + customId + ". The correct answer was: " + data.correct_answer)
                .setFooter({text: "Use /question to play again with another random question!"});

            try {
                const correctEmbed = new MessageEmbed()
                    .setColor('#25ff00')
                    .setTitle("Correct")
                    .setDescription('You have selected the correct answer! You chose: ' + customId)
                    .setFooter({text: "Use /question to play again with another random question!"});

                if(data.correct_answer.charAt(0).toUpperCase() === customId) {
                    reply(interaction, correctEmbed, data)
                    //Log information into console for debugging
                    console.info(interaction.user.username + " has got question " + data.id + " correct in server " + interaction.guild.name)
                } else {
                    reply(interaction, incorrectEmbed, data)
                    //Log information into console for debugging
                    console.info(interaction.user.username + " has got question " + data.id + " wrong in server " + interaction.guild.name)
                }
            } catch(e) {
                console.trace("Unable to display ephemeral response." + e)
                Sentry.captureException(e, {
                    user: {
                        id: interaction.user.id,
                        username: interaction.user.username
                    },
                    level: 'fatal'
                })
            }
        }
    }
});

function reply(interaction, embed, data) {
    if(interaction.isButton()) {
        interaction.deferUpdate().then(r => interaction.message.edit({
            embeds: [interaction.message.embeds[0], embed],
            components: [replyWithFeedback(interaction, data, data.correct_answer.charAt(0).toUpperCase()), addCallToActionTryAgain()]
        }));
    } else {
        interaction.deferUpdate().then(r => interaction.message.edit({
            embeds: [interaction.message.embeds[0], embed],
            components: []
        }));
    }
}

client.login(process.env.TOKEN)