export class SanitizerService {
    LettersAndDigits(input: string) : string {
        return input.split('').filter(c => (/[a-zA-Z0-9]/).test(c)).join('');
    }
}