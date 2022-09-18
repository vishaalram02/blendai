const ngrok = "https://18d0-18-10-156-187.ngrok.io";
async function postImages(imageb64: string, maskb64: string, prompt: string, seed: number):Promise<string>{
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
            seed: seed
        })
    })
    .then((response) => response.text())

}

async function checkProgress(url: string):Promise<string>{
    return fetch(ngrok+url, {mode: 'cors'})
    .then((response) => response.text())
}

export {postImages, checkProgress}