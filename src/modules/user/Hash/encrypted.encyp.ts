// import { createCipheriv, randomBytes, scrypt } from 'crypto';
// import { promisify } from 'util';

// const iv = randomBytes(16);
// const password = 'Password used to generate key';

// const key = (await promisify(scrypt)(password, 'salt', 32)) as Buffer;
// const cipher = createCipheriv('aes-256-gcm', key, iv)

// const textToEncrypt = 'Nest';
// const encrytedText = Buffer.concat([
//     cipher.update(textToEncrypt),
//     cipher.final(),
// ]);

// const saltOrRound = 10;
// const pw = 'random_password';
// const hash = await bcrypt.hash(pw, saltOrRound);

// const salt = await bcrypt.genSalt();

// const isMatch = await bcrypt.compare(password, hash)
