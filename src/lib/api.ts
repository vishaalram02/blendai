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
    .then((response) => response.json())
    .then((response) => response.task_id)
}

async function getStatus(task: string, seed: number){
    const url = "/getStatus"
    return fetch(url, {
        method: "POST",
        mode: 'cors',
        body: JSON.stringify({
            task: task,
            seed: seed,
        })
    })
    .then((response) => response.json())
}

export {postImages, getStatus}