import DiscordJS, {Intents, MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu} from 'discord.js'
import dotenv from 'dotenv'
import {fetchRandomQuestion, fetchQuestion, getStatistics, createButtonRow} from './functions.js'
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

Sentry.init({
    dsn: "https://a2262a26872d49e6846cf6cff352c9ee@o1208828.ingest.sentry.io/6342124",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});
dotenv.config()

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

    if (interaction.isCommand()) {
        if(commandName === 'question') {
            let data = await fetchRandomQuestion();

            try {
                let MenuOptions;
                let selectMenu = new MessageActionRow()
                    .addComponents(
                        MenuOptions = new MessageSelectMenu()
                            .setCustomId(data.id + 'select')
                            .setPlaceholder('Select an answer...'),
                    );

                let splitOptions = data.options.split(/\r?\n/)
                splitOptions.forEach(function (element) {
                    MenuOptions.addOptions([{
                        label: element,
                        value: element.charAt(0).toUpperCase() //Convert to Upper Case to check against correct answer
                    }])
                });

                const questionEmbed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle(data.question)
                    .setAuthor({name: 'EHU Quiz & Party Game Question Bank', url: 'https://ehuquizsociety.com'})
                    .setDescription(data.options)
                    .addField('Question Category', data.category.name, true)
                    .setTimestamp()
                    .setFooter({text: 'Question ID: ' + data.id});

                //Log the info into the console for debugging purposes
                console.info(interaction.user.username + " has requested question " + data.id + " in server " + interaction.guild.name)

                /** If there are more options than A-F, use a select menu, else, use a button row **/
                if(data.options.split(/\r\n|\r|\n/).length > 4) {
                    interaction.reply({
                        embeds: [questionEmbed],
                        components: [selectMenu]
                    })
                } else {
                    interaction.reply({
                        embeds: [questionEmbed],
                        components: [createButtonRow(data.id)]
                    })
                }
            } catch(e) {
                interaction.reply({
                    content: "Looks like the API isn't reachable at the moment! Please try again later...",
                })
                Sentry.captureException(e);
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
                Sentry.captureException(e);
            }
        }
    }

    if (interaction.isSelectMenu() || interaction.isButton()) {
        let questionID = interaction.customId.match(/\d+/g);
        let data = await fetchQuestion(questionID);
        let customId = interaction.customId.replace(/[0-9]/g,'');
        let array = ['select','A','B','C','D'];

        //Log information into console for debugging
        console.info(interaction.user.username + " has interacted with question " + data.id + " in server " + interaction.guild.name)

        if (array.includes(customId)) {
            const incorrectEmbed = new MessageEmbed()
                .setColor('#ff0000')
                .setTitle("Incorrect")
                .setDescription("That wasn't right! You chose: " + customId + ". The correct answer was: " + data.correct_answer)

            try {
                if(data.options.split(/\r\n|\r|\n/).length > 4) {
                    const correctEmbed = new MessageEmbed()
                        .setColor('#25ff00')
                        .setTitle("Correct")
                        .setDescription('You have selected the correct answer! You chose: ' + interaction.values[0]);

                    if(data.correct_answer.charAt(0).toUpperCase() === interaction.values[0].charAt(0).toUpperCase()) {
                        await interaction.reply({ embeds: [correctEmbed], ephemeral: true });
                        //Log information into console for debugging
                        console.info(interaction.user.username + " has got question " + data.id + " correct in server " + interaction.guild.name)
                    } else {
                        await interaction.reply({ embeds: [incorrectEmbed], ephemeral: true });
                        //Log information into console for debugging
                        console.info(interaction.user.username + " has got question " + data.id + " wrong in server " + interaction.guild.name)
                    }
                } else {
                    const correctEmbed = new MessageEmbed()
                        .setColor('#25ff00')
                        .setTitle("Correct")
                        .setDescription('You have selected the correct answer! You chose: ' + customId);

                    if(data.correct_answer.charAt(0).toUpperCase() === customId) {
                        await interaction.reply({ embeds: [correctEmbed], ephemeral: true });
                        //Log information into console for debugging
                        console.info(interaction.user.username + " has got question " + data.id + " correct in server " + interaction.guild.name)
                    } else {
                        await interaction.reply({ embeds: [incorrectEmbed], ephemeral: true });
                        //Log information into console for debugging
                        console.info(interaction.user.username + " has got question " + data.id + " wrong in server " + interaction.guild.name)
                    }
                }
            } catch(e) {
                console.error("Unable to proceed with interaction. Error: " + e)
                Sentry.captureException("Unable to proceed with interaction. Error: " + e);
            }
        } else {
            console.log("Not In Array! CustomID " + customId)
        }
    }
});

client.login(process.env.TOKEN)