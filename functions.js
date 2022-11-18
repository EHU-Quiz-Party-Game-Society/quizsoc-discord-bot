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

export function replyWithFeedback(interaction, question_id, correct) {
    try {
        switch(correct) {
            case 'A':
                return new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(question_id + 'A')
                            .setLabel('A')
                            .setStyle('SUCCESS')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'B')
                            .setLabel('B')
                            .setStyle('DANGER')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'C')
                            .setLabel('C')
                            .setStyle('DANGER')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'D')
                            .setLabel('D')
                            .setStyle('DANGER')
                            .setDisabled(true),
                    );
            case 'B':
                return new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(question_id + 'A')
                            .setLabel('A')
                            .setStyle('DANGER')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'B')
                            .setLabel('B')
                            .setStyle('SUCCESS')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'C')
                            .setLabel('C')
                            .setStyle('DANGER')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'D')
                            .setLabel('D')
                            .setStyle('DANGER')
                            .setDisabled(true),
                    );
            case 'C':
                return new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(question_id + 'A')
                            .setLabel('A')
                            .setStyle('DANGER')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'B')
                            .setLabel('B')
                            .setStyle('DANGER')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'C')
                            .setLabel('C')
                            .setStyle('SUCCESS')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'D')
                            .setLabel('D')
                            .setStyle('DANGER')
                            .setDisabled(true),
                    );
            case 'D':
                return new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(question_id + 'A')
                            .setLabel('A')
                            .setStyle('DANGER')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'B')
                            .setLabel('B')
                            .setStyle('DANGER')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'C')
                            .setLabel('C')
                            .setStyle('DANGER')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'D')
                            .setLabel('D')
                            .setStyle('SUCCESS')
                            .setDisabled(true),
                    );
            default:
                return new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId(question_id + 'A')
                            .setLabel('A')
                            .setStyle('SECONDARY')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'B')
                            .setLabel('B')
                            .setStyle('SECONDARY')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'C')
                            .setLabel('C')
                            .setStyle('SECONDARY')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId(question_id + 'D')
                            .setLabel('D')
                            .setStyle('SECONDARY')
                            .setDisabled(true),
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