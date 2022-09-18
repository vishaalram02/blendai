const ngrok = "https://8abd-18-10-156-187.ngrok.io"
async function postImages(imageb64: string, maskb64: string, prompt: string):Promise<string>{
    const url = ngrok + "/processImage"
    // console.log("posting image")
    return fetch(url, {
        method: "POST",
        mode: 'cors',
        // headers: {
        //     'Content-Type': 'application/json'
        // },
        body: JSON.stringify({
            baseImage: imageb64,
            maskImage: maskb64,
            prompt: prompt,
        })
    })
    .then((response) => response.text())

}

async function checkProgress(url: string):Promise<string>{
    return fetch(ngrok+url, {mode: 'cors'})
    .then((response) => response.text())
}

export {postImages, checkProgress}