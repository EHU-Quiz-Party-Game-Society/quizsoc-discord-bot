import fetch from "node-fetch";
import {MessageActionRow, MessageAttachment, MessageButton, MessageEmbed, MessageSelectMenu} from "discord.js";
import * as Sentry from "@sentry/node";
import * as JimpObj from 'jimp';
const Jimp = JimpObj.default;

export async function fetchRandomQuestion(interaction) {
    try {
        //Get API data - Only get Multiple Choice Questions
        let response = await fetch(process.env.URL + '/api/question/random?type=1');
        let data = await response.json();
        data = JSON.stringify(data);
        data = JSON.parse(data);
        return data;
    } catch(e) {
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

export async function fetchQuestion(interaction, questionID) {
    try {
        //Get API data - Only get Multiple Choice Questions
        let response = await fetch(process.env.URL + '/api/question/' + questionID, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        let data = await response.json();
        data = JSON.stringify(data);
        data = JSON.parse(data);
        return data;
    } catch(e) {
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

export async function getStatistics(interaction) {
    try {
        //Get API data - Only get Multiple Choice Questions
        let response = await fetch(process.env.URL + '/api/stats');
        let data = await response.json();
        data = JSON.stringify(data);
        data = JSON.parse(data);
        return data;
    } catch(e) {
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

export function createButtonRow(interaction, question_id) {
    try {
        return new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(question_id + 'A')
                    .setLabel('A')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(question_id + 'B')
                    .setLabel('B')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(question_id + 'C')
                    .setLabel('C')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(question_id + 'D')
                    .setLabel('D')
                    .setStyle('PRIMARY'),
            );
    } catch(e) {
        console.error("Unable to create button row")
        Sentry.captureException(e, {
            user: {
                id: interaction.user.id,
                username: interaction.user.username
            },
            level: 'error'
        })
    }
}

export async function getBingoCard(interaction, code) {
    try {
        let response = await fetch(process.env.URL + '/api/bingo/card/' + code);
        let data = await response.json();
        data = JSON.stringify(data);
        data = JSON.parse(data);
        if(data.code === code) {
            const image = await Jimp.read('./BingoBackground.png');
            //Set security data
            let font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
            image.print(font, 60, 15, data.sheet);
            image.print(font, 975, 15, data.code);

            //Insert numbers for top row
            let x = 100; //X position of number
            font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
            for (let i=0; i < data.data['one'].length; i++) {
                if(data.data['one'][i] != null) {
                    image.print(font, x, 90, data.data['one'][i]);
                }
                x+=117;
            }

            //Insert numbers for middle row
            x = 100;
            for (let i=0; i < data.data['two'].length; i++) {
                if(data.data['two'][i] != null) {
                    image.print(font, x, 210, data.data['two'][i]);
                }
                x+=117;
            }

            //Insert numbers for bottom row
            x = 100;
            for (let i=0; i < data.data['three'].length; i++) {
                if(data.data['three'][i] != null) {
                    image.print(font, x, 330, data.data['three'][i]);
                }
                x+=117;
            }

            // Writing image after processing
            await image.writeAsync('./output.png');

            return new MessageAttachment('./output.png');
        } else {
            interaction.reply({
                content: "Unable to generate bingo card. Please check the code in the top right of the bingo card!"
            })
        }

    } catch (e) {
        console.error("Unable to generate bingo card. Does the card exist?" + e)
        Sentry.captureException(e, {
            user: {
                id: interaction.user.id,
                username: interaction.user.username
            },
            level: 'error'
        })
    }
}