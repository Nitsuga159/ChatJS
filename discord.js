const crypto = require('crypto');
const http = require('http');
const https = require('https');

const EMOTICONS = ["✅", "💯", "☑️"]

const state = {
    isSending: false,
    toggle: false,
    user1: null,
    user2: null
}

function makeHttpRequest({ method, url, body, headers }) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            method: method,
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            headers: headers,
        };

        const client = parsedUrl.protocol === 'https:' ? https : http;

        const req = client.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedResponse = JSON.parse(responseData);
                    resolve(parsedResponse);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

function generateNonce() {
    const randomBytes = crypto.randomBytes(8); // Genera 8 bytes de datos aleatorios
    const nonce = parseInt(randomBytes.toString('hex'), 16).toString(); // Convierte los bytes a un número y luego a una cadena

    return nonce;
}

function getRandomTimeSeconds(top) {
    return Math.random() * top * 1000
}

function isValidMessageNumber(message) {
    const number = message.content

    return !isNaN(parseInt(number)) && parseInt(number) === Number(number) && message.reactions.some(({ emoji: { name } }) => EMOTICONS.includes(name))
}


function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)]
}

function getLastMessageWithNumber(messages) {
    let index = messages.findIndex(isValidMessageNumber)

    return messages[index]
}

function waitPromise(seconds) {
    return new Promise((resolve) => setTimeout(() => resolve(true), seconds * 1000))
}

const baseURL = 'https://discord.com/api/v9/channels/943283709510033448/messages'

const RESPONSES = [
    'Feliciten al pelotudo que se mete y hace cagada, pato CRIOLLO!!',
    'Nene si ves autos pasando por la calle no cruzas, entendes ?',
    'Miren alguien que necesita atencion, peguenle.',
    'Tipico de zurdo, corta donde se transita',
    'Cuando pasa por las calles las palomas le dicen glu glu pelotudo glu glu'
]

const GET_USER_INFO = (auth) => ({
    method: 'GET',
    url: 'https://discord.com/api/v9/users/@me',
    headers: { 'Content-Type': 'application/json', 'Authorization': auth },
})


const GET_LAST_MESSAGE_REQUEST = (auth) => ({
    method: 'GET',
    url: `${baseURL}?limit=1`,
    headers: { 'Content-Type': 'application/json', 'Authorization': auth },
});

const GET_MESSAGES_REQUEST = (auth) => ({
    method: 'GET',
    url: `${baseURL}?limit=100`,
    headers: { 'Content-Type': 'application/json', 'Authorization': auth },
});

const POST_MESSAGE_REQUEST = (auth, content) => ({
    method: 'POST',
    url: baseURL,
    headers: { 'Content-Type': 'application/json', 'Authorization': auth },
    body: {
        "mobile_network_type": "unknown",
        "content": content.toString(),
        "nonce": generateNonce(),
        "tts": false,
        "flags": 0
    }
})

async function main({ auth1, auth2, number, intervalSeconds }) {
    const [user1, user2] = await Promise.all([
        makeHttpRequest(GET_USER_INFO(auth1)),
        makeHttpRequest(GET_USER_INFO(auth2)),
    ])

    state.user1 = user1
    state.user2 = user2

    let message = null


    while (true) {
        let auth = state.toggle ? auth1 : auth2

        await makeHttpRequest(POST_MESSAGE_REQUEST(auth, number))

        while (true) {
            await waitPromise(intervalSeconds)

            message = await makeHttpRequest(GET_LAST_MESSAGE_REQUEST(auth))

            if (isValidMessageNumber(message) && parseInt(message?.contet) === number) {
                break
            } else {
                console.log("Mensaje inválido: ", message)
            }
        }

        number++
        state.toggle = !state.toggle
    }
}

main({
    auth1: 'NTUzNjEzNTI4ODAwNTU5MTE2.Gpp36F.cgAhbK0iF3g4TEgxgy86VFifzyWFtFOq_axCc4',
    auth2: 'NjYyMDYxMjE1MTYxMzg1MDEy.Gwk4Me.qe7QKkgBRwCpQt2ssyhDnOhv5GTmodxjR7a8SQ',
    number: 1,
    intervalSeconds: 1
})
