import DiscordJS, {Client, Intents, MessageActionRow, MessageEmbed, MessageSelectMenu} from 'discord.js'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import {quote} from "@discordjs/builders";
dotenv.config()

const client = new DiscordJS.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

client.on('ready', () => {
    console.log('Quiz Client: JS Bot Ready')

    const guildId = process.env.GUILD_ID
    const guild = client.guilds.cache.get(guildId)
    let commands

    if(guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'question',
        description: 'Gets a random multiple choice question from the Quiz Database and awaits your response'
    })
})

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

async function fetchRandomQuestion() {
    //Get API data - Only get Multiple Choice Questions
    let response = await fetch(process.env.URL + '/api/question/random?type=1');
    let data = await response.json();
    data = JSON.stringify(data);
    data = JSON.parse(data);
    return data;
}

async function fetchQuestion(questionID) {
    //Get API data - Only get Multiple Choice Questions
    let response = await fetch(process.env.URL + '/api/question/' + questionID);
    let data = await response.json();
    data = JSON.stringify(data);
    data = JSON.parse(data);
    return data;
}

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        let data = await fetchRandomQuestion();

        let addToMessageEmbed;
        const row = new MessageActionRow()
            .addComponents(
                addToMessageEmbed = new MessageSelectMenu()
                    .setCustomId('select')
                    .setPlaceholder('Select an answer...'),
            );

        let splitOptions = data.options.split(/\r?\n/)
        splitOptions.forEach(function (element) {
            addToMessageEmbed.addOptions([{
                label: element,
                value: element.charAt(0).toUpperCase() //Convert to Upper Case to check against correct answer
            }])
        });

        const exampleEmbed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(data.question)
            .setAuthor({ name: 'EHU Quiz & Party Game Question Bank', url: 'https://ehuquizsociety.com' })
            .setDescription(data.options)
            .addField('Question Category', data.category.name, true)
            .setTimestamp()
            .setFooter({ text: 'Question ID: ' + data.id});

        const { commandName, options } = interaction

        if (commandName === 'question') {
            interaction.reply({
                embeds: [exampleEmbed],
                components: [row]
            })
        }
    }

    if (!interaction.isSelectMenu()) return;
    let questionID = interaction.message.embeds[0].footer.text.match(/\d/g).join("");
    let data = await fetchQuestion(questionID);


    if (interaction.customId === 'select') {

        const correctEmbed = new MessageEmbed()
            .setColor('#25ff00')
            .setTitle("Correct")
            .setDescription("You have selected the correct answer! You chose: " + interaction.values[0])

        const incorrectEmbed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle("Incorrect")
            .setDescription("That wasn't right! You chose: " + interaction.values[0] + ". The correct answer was: " + data.correct_answer)

        if(data.correct_answer.charAt(0).toUpperCase() === interaction.values[0].charAt(0).toUpperCase()) {
            await interaction.reply({ embeds: [correctEmbed] });
        } else {
            await interaction.reply({ embeds: [incorrectEmbed] });
        }
    }
})

client.login(process.env.TOKEN)