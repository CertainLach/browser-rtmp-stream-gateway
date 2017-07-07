// By F6CF :D

const {
    readFileSync
} = require('fs');
const {
    spawn
} = require('child_process');
const {
    Server: WsServer
} = require('uws');
const {
    createServer: createHttpsServer
} = require('https');
const {
    createServer: createHttpServer
} = require('http');

const PORT = 8448;
const HOST = '0.0.0.0';
const KEY = `-----BEGIN RSA PRIVATE KEY-----\nMIIEpQIBAAKCAQEAvLPxyH6WKS0v093Hi+cDdyIEMscnnzpsc4ipRvXaOnNuRL0r\n+1OM1dXAJPBmQ2oLINAoH+nBmJo33L3NGztRAaM4aoYG4Phkjp+xrjhvnCG54hPY\n0pFNhe28toB0ztLa4SrOqoDUM2cokqyVQuTq3K2t0JVX/+4YTzEfjYzCppKsLiKi\n+oUFgrq6wvVLXCFLxCCxjC1jMcUVDINplNETgeTs48gEY/ZBoWM30Teo+bEvfZr5\n7QdazHSjj3FOABwuk+zv/KB40zofcvcCSB7ssvdiHbo39nF6FoxNnziP+ePR3wZi\niXLUfZgf00/dx6EczJiIg+EN8UNfDY3qr/DZ8wIDAQABAoIBAQCdkNesJV83RL7x\n9vb/b8dp+6Jrz/XatAsIsa0/TlyJgAcsKJWIB2zKxO/rKD0Lv4lJPeazNxnrVaKd\nlHKmcXIjnumlsQIfael1Wg0gP4maYmL3TsE2mhOUaD2yWjKu3EvdxkPJBUerIFE1\noBwGPmWKHQ/M4lcXofT0cz04kbebI+C49Eq1lRI7jk5AxJtmlVv4eEkINZt/sPSG\naGOsfuZj1ffE9iXDmfYir3LAv0nufuz1o5w0EWPrLSL6EJZfrq3s3KLWOBxY2LeL\nPvFwi0+Wll+ZKcDMj00C53s81Ic2tZeRooLRX7WUSnRekB7I/fspCidxNlE3u1AW\nTzk09ZABAoGBAOAEK2wxX3dDfsqhoTp+T4tCMXONShEk9doMTwnln3YzMOWeGZ0J\nqgjB0vHL8mKA1R9olYq6xURonkv2lMvXuemqEGgJd6smpOLDaKJh3x0v4NvKuluL\nMEC6ll2oi1HzAQCd01rSVTGU/zZcv5tuzWoa352/W+8Mv2DgeM7PsdgBAoGBANel\nELdHpMqpbLQXTcl94cIDw8tUCmEfGntB7+LLIinJmtHnmaq99Ouq4EH6UHUb8ZlD\n0rER+yrdCF+xqEjgtKcIxZFQ6xGHwH5hbfO+dpAB2wEZPe4oKTHTlkAuqld3H8DL\nybDsRUdi2G2emxZc5xVYlY/2wmIVhCq0PtqYyNHzAoGBANQ+fxmyKb4ov9+ihcyS\n0jCiFZJionNd7mWaVeSNn6jw1XoociIcfvJvGbqoPc1gPQzWHSFk1fR7nsdgKBh+\nGxItY//+QFhzc7O56tA3JJpVu5jjGfAUDzK01jSEtQN+1ktMPW0GbVtdzPQnqg7N\nS2glcArYvHTgQg66fxuLIvgBAoGBAJwmitQsrMeTp4NA3LLq1G8JCt5RHLL3MtXO\nCUbQkQxxUApvCnb41kFQmtMrztb+RRQWaJqPyrBfHZEttA4RqL7LO0Tes1keU+Uv\n5854PKJKtas1/AJYUnwiGsqe//oV6IhTCNl0PTZT/SRjlSm8XBi47JQyus8LhYjm\nvBzORZzBAoGAI6WDJSfW7FhVgvqDWLD5LoPNhzvn/7S2Bz5KvnY0qE5unVuOdTUe\nrsEcPoivheChQfzRvpEFwCf8/KQKxTrqo+uFMYWgsyCAidDoYBydz/Y1FP86er+B\nPm6ne61QwDj3bJstlA2c4NZRYA+lY3vRwmYWJXHY04s3uxzOyC4E9B4=\n-----END RSA PRIVATE KEY-----`;
const CERT = `-----BEGIN CERTIFICATE-----\nMIIDijCCAnICCQCTtLzNQpNUGTANBgkqhkiG9w0BAQsFADCBhjELMAkGA1UEBhMC\nSlAxDjAMBgNVBAgMBVRva3lvMRAwDgYDVQQHDAdTaGlidXlhMRMwEQYDVQQKDApQ\ncml2YXRlX0NBMQ4wDAYDVQQLDAVBZG1pbjEOMAwGA1UEAwwFZ3RrMmsxIDAeBgkq\nhkiG9w0BCQEWEWd0azJrQHlhaG9vLmNvLmpwMB4XDTE3MDYxNzAxNDgwOFoXDTI3\nMDYxNTAxNDgwOFowgYYxCzAJBgNVBAYTAkpQMQ4wDAYDVQQIDAVUb2t5bzEQMA4G\nA1UEBwwHU2hpYnV5YTETMBEGA1UECgwKUHJpdmF0ZV9DQTEOMAwGA1UECwwFQWRt\naW4xDjAMBgNVBAMMBWd0azJrMSAwHgYJKoZIhvcNAQkBFhFndGsya0B5YWhvby5j\nby5qcDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALyz8ch+liktL9Pd\nx4vnA3ciBDLHJ586bHOIqUb12jpzbkS9K/tTjNXVwCTwZkNqCyDQKB/pwZiaN9y9\nzRs7UQGjOGqGBuD4ZI6fsa44b5whueIT2NKRTYXtvLaAdM7S2uEqzqqA1DNnKJKs\nlULk6tytrdCVV//uGE8xH42MwqaSrC4iovqFBYK6usL1S1whS8QgsYwtYzHFFQyD\naZTRE4Hk7OPIBGP2QaFjN9E3qPmxL32a+e0HWsx0o49xTgAcLpPs7/ygeNM6H3L3\nAkge7LL3Yh26N/ZxehaMTZ84j/nj0d8GYoly1H2YH9NP3cehHMyYiIPhDfFDXw2N\n6q/w2fMCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAiqlPe0nu5C2AaIpiYER9/LoD\nv9dcr60FBRbTWDmC4F+TfNITRTOivOhReaXnz/6UHJfKHLvYtDsvQBhbgNeXv3y5\n9U3yLQEzCAIupsQWb7OiSjSR7BM+5S1ispmh0y3JKtymmctLEL+15nFcZUEEAFb1\nDWmjAPE8Z3QaUZ917icPUR14FSHVFR5QJ4SXKmAG4EsmUu3nlGaXNVqAqu3uDQrL\nECu8F4puo7cE1Gr/E942FqYdovMNu5UHvpGgkvusnef1V+1IPUHKyVX0JXC9Cojq\nVCMFF9eehXQgS/qRZZtMY8uz3M3wPZI/dQzNmTbxp1WavNagbgRnbQVeGOrwlw==\n-----END CERTIFICATE-----`;
const HTTPS = false;

// Https server
let server;


if(HTTPS){
    server = createHttpsServer({
        key: KEY,
        cert: CERT
    }, (req, res) => {
        res.end(readFileSync('./index.html'));
    });
} else {
    server = createHttpServer((req,res) => {
        res.end(readFileSync('./index.html'));
    });
}
const wss = new WsServer({
    server
});
server.listen(PORT, HOST, () => console.log(`Bridge listening on ${HOST}:${PORT}`));

let users = 0;

wss.on('connection', function(ws, req) {
    let ffmpeg = null;
    let user = users++;
    let dataSent = false;
    console.log('>> USER CONNECTED', user);
    ws.on('message', data => {
        if (ffmpeg === null) {
            // data - our start packet
            let [url, codec] = data.split('\xf6\xcf');
            ffmpeg = spawn('ffmpeg', ['-vcodec', codec, '-i', '-', '-c:v', 'libx264', '-g', '10', '-preset', 'veryfast', '-tune', 'fastdecode,zerolatency', '-bufsize', '4000k', '-threads', '0', '-acodec', 'aac', '-strict', 'experimental', '-ac', '1', '-ab', '96k', '-ar', '44100', '-vsync', 'passthrough', '-f', 'flv', url]);

            // For debug

            ffmpeg.stdout.on('data', d=>{
                console.log(d.toString());
            });

            ffmpeg.stderr.on('data', d=>{
                console.log(d.toString());
            });

            ffmpeg.on('error', e => {
                ws.close(1011);
            });

            ffmpeg.on('exit', e => {
                ws.close(1011);
            });
            console.log('>> STREAM STARTED', user);
            setTimeout(()=>{
                console.log('>> START PACKET SENT', user);
                ws.send('\x44');
            },2000);
        } else {
            if(!dataSent){
                console.log('>> GOT FIRST PACKET OF DATA');
                dataSent=true;
            }
            ffmpeg.stdin.write(new Buffer(new Uint8Array(data)));
        }
    });


    ws.on('close', () => {
        console.log('<< USER DISCONNECTED', user);
        if (ffmpeg) {
            console.log('<< KILLING FFMPEG', user);
            try {
                ffmpeg.stdin.end();
                ffmpeg.kill('SIGINT');
            } catch (e) {
                console.warn('<< FFMPEG IS NOT KILLED!', user);
            }
        }
    });

    ws.on('error', e => {
        ws.close(1012);
    });
});

process.on('uncaughtException', function (err) { console.log(err) });