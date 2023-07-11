async function postImages(imageb64: string, maskb64: string, prompt: string, seed: number):Promise<string>{
    const url = "/processImage"
    return fetch(url, {
        method: "POST",
        mode: 'cors',
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
    return fetch(url, {mode: 'cors'})
    .then((response) => response.text())
}

export {postImages, checkProgress}