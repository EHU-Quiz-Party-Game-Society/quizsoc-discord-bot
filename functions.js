import fetch from "node-fetch";
import {MessageActionRow, MessageAttachment, MessageButton, MessageEmbed, MessageSelectMenu} from "discord.js";
import * as Sentry from "@sentry/node";

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

export function createButtonRow(interaction, data) {
    try {
        let options = data.options.split(/\r\n|\r|\n/);
        return new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(data.id + 'A')
                    .setLabel(options[0])
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(data.id + 'B')
                    .setLabel(options[1])
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(data.id + 'C')
                    .setLabel(options[2])
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId(data.id + 'D')
                    .setLabel(options[3])
                    .setStyle('PRIMARY'),
            );
    } catch(e) {
        console.error("Unable to create button row.")
        console.log("Requested Question: " + data)
        Sentry.captureException(e, {
            user: {
                id: interaction.user.id,
                username: interaction.user.username
            },
            level: 'error'
        })
    }
}

export function replyWithFeedback(interaction, data, correct) {
    try {
        //console.log(interaction.message.embeds[0])
        let question_id = data.id;
        let customId = interaction.customId.replace(/[0-9]/g,'');
        let options = data.options.split(/\r\n|\r|\n/);
        switch(true) {
            case customId && correct === 'A':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SUCCESS'),
                        addOption(question_id + 'B', options[1], 'SECONDARY'),
                        addOption(question_id + 'C', options[2], 'SECONDARY'),
                        addOption(question_id + 'D', options[3], 'SECONDARY'),
                    );
            case customId === 'A' && correct === 'B':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'DANGER'),
                        addOption(question_id + 'B', options[1], 'SUCCESS'),
                        addOption(question_id + 'C', options[2], 'SECONDARY'),
                        addOption(question_id + 'D', options[3], 'SECONDARY'),
                    );
            case customId === 'A' && correct === 'C':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'DANGER'),
                        addOption(question_id + 'B', options[1], 'SECONDARY'),
                        addOption(question_id + 'C', options[2], 'SUCCESS'),
                        addOption(question_id + 'D', options[3], 'SECONDARY'),
                    );
            case customId === 'A' && correct === 'D':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'DANGER'),
                        addOption(question_id + 'B', options[1], 'SECONDARY'),
                        addOption(question_id + 'C', options[2], 'SECONDARY'),
                        addOption(question_id + 'D', options[3], 'SUCCESS'),
                    );
            case customId === 'B' && correct === 'A':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SUCCESS'),
                        addOption(question_id + 'B', options[1], 'DANGER'),
                        addOption(question_id + 'C', options[2], 'SECONDARY'),
                        addOption(question_id + 'D', options[3], 'SECONDARY'),
                    );
            case customId && correct === 'B':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SECONDARY'),
                        addOption(question_id + 'B', options[1], 'SUCCESS'),
                        addOption(question_id + 'C', options[2], 'SECONDARY'),
                        addOption(question_id + 'D', options[3], 'SECONDARY'),
                    );
            case customId === 'B' && correct === 'C':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SECONDARY'),
                        addOption(question_id + 'B', options[1], 'DANGER'),
                        addOption(question_id + 'C', options[2], 'SUCCESS'),
                        addOption(question_id + 'D', options[3], 'SECONDARY'),
                    );
            case customId === 'B' && correct === 'D':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SECONDARY'),
                        addOption(question_id + 'B', options[1], 'DANGER'),
                        addOption(question_id + 'C', options[2], 'SECONDARY'),
                        addOption(question_id + 'D', options[3], 'SUCCESS'),
                    );
            case customId === 'C' && correct === 'A':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SUCCESS'),
                        addOption(question_id + 'B', options[1], 'SECONDARY'),
                        addOption(question_id + 'C', options[2], 'DANGER'),
                        addOption(question_id + 'D', options[3], 'SECONDARY'),
                    );
            case customId === 'C' && correct === 'B':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SECONDARY'),
                        addOption(question_id + 'B', options[1], 'SUCCESS'),
                        addOption(question_id + 'C', options[2], 'DANGER'),
                        addOption(question_id + 'D', options[3], 'SECONDARY'),
                    );
            case customId && correct === 'C':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SECONDARY'),
                        addOption(question_id + 'B', options[1], 'SECONDARY'),
                        addOption(question_id + 'C', options[2], 'SUCCESS'),
                        addOption(question_id + 'D', options[3], 'SECONDARY'),
                    );
            case customId === 'C' && correct === 'D':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SECONDARY'),
                        addOption(question_id + 'B', options[1], 'SECONDARY'),
                        addOption(question_id + 'C', options[2], 'DANGER'),
                        addOption(question_id + 'D', options[3], 'SUCCESS'),
                    );
            case customId === 'D' && correct === 'A':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SUCCESS'),
                        addOption(question_id + 'B', options[1], 'SECONDARY'),
                        addOption(question_id + 'C', options[2], 'SECONDARY'),
                        addOption(question_id + 'D', options[3], 'DANGER'),
                    );
            case customId === 'D' && correct === 'B':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SECONDARY'),
                        addOption(question_id + 'B', options[1], 'SUCCESS'),
                        addOption(question_id + 'C', options[2], 'SECONDARY'),
                        addOption(question_id + 'D', options[3], 'DANGER'),
                    );
            case customId === 'D' && correct === 'C':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SECONDARY'),
                        addOption(question_id + 'B', options[1], 'SECONDARY'),
                        addOption(question_id + 'C', options[2], 'SUCCESS'),
                        addOption(question_id + 'D', options[3], 'DANGER'),
                    );
            case customId && correct === 'D':
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', options[0], 'SECONDARY'),
                        addOption(question_id + 'B', options[1], 'SECONDARY'),
                        addOption(question_id + 'C', options[2], 'SECONDARY'),
                        addOption(question_id + 'D', options[3], 'SUCCESS'),
                    );
            default:
                return new MessageActionRow()
                    .addComponents(
                        addOption(question_id + 'A', 'A', 'SECONDARY'),
                        addOption(question_id + 'B', 'B', 'SECONDARY'),
                        addOption(question_id + 'C', 'C', 'SECONDARY'),
                        addOption(question_id + 'D', 'D', 'SECONDARY'),
                    );
        }

    } catch(e) {
        console.error("Unable to create button row" + e)
        Sentry.captureException(e, {
            user: {
                id: interaction.user.id,
                username: interaction.user.username
            },
            level: 'error'
        })
    }
}

function addOption(question_id, option, type) {
    return new MessageButton()
        .setCustomId(question_id)
        .setLabel(option)
        .setStyle(type)
        .setDisabled(true)
}

export function addCallToActionTryAgain() {
    return new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('requestNewQuestion')
                .setEmoji('🔄')
                .setLabel('Get another question!')
                .setStyle('PRIMARY')
        )
}