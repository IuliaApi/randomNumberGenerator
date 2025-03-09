function xorshift32(seed) {
    seed ^= seed << 13;
    seed ^= seed >> 17;
    seed ^= seed << 5;

    return seed & 0xFFFFFFFF;
}

async function getInitialData() {
    const response = await fetch("http://api25.vanierhacks.net/reverse-engineering/xorshift-java/");
    const data = await response.json();
    return data;
}

async function sendGeneratedNumbers(uid, generatedNumbers) {
    const response = await fetch("http://api25.vanierhacks.net/reverse-engineering/xorshift-java/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uid: uid,
            generated: generatedNumbers
        })
    });

    const result = await response.json();
    console.log(result);
}

async function generateRandomNumbers() {
    const data = await getInitialData();
    const initialSeed = data.initialSeed;
    const uid = data.uid;

    let seed = initialSeed;
    const generatedNumbers = [];

    for (let i = 0; i < 128; i++) {
        seed = xorshift32(seed);
        generatedNumbers.push(seed);
    }

    await sendGeneratedNumbers(uid, generatedNumbers);
}

generateRandomNumbers();
