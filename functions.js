import fetch from "node-fetch";
import {MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu} from "discord.js";
import * as Sentry from "@sentry/node";

export async function fetchRandomQuestion() {
    try {
        //Get API data - Only get Multiple Choice Questions
        let response = await fetch(process.env.URL + '/api/question/random?type=1');
        let data = await response.json();
        data = JSON.stringify(data);
        data = JSON.parse(data);
        return data;
    } catch(e) {
        console.error("Unable to reach API.")
        Sentry.captureException("Unable to reach API." + e);
    }
}

export async function fetchQuestion(questionID) {
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
        console.error("Unable to reach API.")
        Sentry.captureException("Unable to reach API." + e);
    }
}

export async function getStatistics() {
    try {
        //Get API data - Only get Multiple Choice Questions
        let response = await fetch(process.env.URL + '/api/stats');
        let data = await response.json();
        data = JSON.stringify(data);
        data = JSON.parse(data);
        return data;
    } catch(e) {
        console.error("Unable to reach API.")
        Sentry.captureException("Unable to reach API." + e);
    }
}

export function createButtonRow(question_id) {
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
        console.error("Unable to create button row.")
        Sentry.captureException("Unable to create button row." + e);
    }
}

export function createSelectMenu(data) {
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
}