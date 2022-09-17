function postImages(imageb64: string, maskb64: string, prompt: string):Promise<string>{
    const url = "http://localhost:9000/processImage"
    return fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            baseImage: imageb64,
            maskImage: maskb64,
            prompt: prompt,
        })
    })
    .then((response) => response.text())

}

async function checkProgress(url: string):Promise<string>{
    return fetch(url)
    .then((response) => response.text())
}

export {postImages, checkProgress}