import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'src/app/services';
import { StrengthEnum } from '../../models';

@Component({
    selector: 'password-generator',
    templateUrl: './password-generator.component.html',
    styleUrls: ['./password-generator.component.scss']
})
export class PasswordGeneratorComponent {
    public min: number = 4;
    public max: number = 60;
    public value: number;
    public strength: number;
    public strengthLabel: StrengthEnum;
    public password!: string;
    public checkUpperCase: boolean;
    public checkNumbers: boolean;
    public checkSymbols: boolean;

    private characterers: string;
    private numbers: string;
    private symbols: string;

    constructor(private snackBarService: SnackBarService, private translate: TranslateService) {
        this.value = this.min;
        this.strength = 0;
        this.strengthLabel = StrengthEnum.VERY_WEAK;
        this.checkUpperCase = false;
        this.checkNumbers = false;
        this.checkSymbols = false;
        this.characterers = "abcdefghijklmnopqrstuvwxyz";
        this.numbers = "0123456789";
        this.symbols = "|!£$%&/()=?'^[]@#§,;.:-_<>é*+ç°§€~" + '"\\';

        this.generate();
    }

    public generate(): void {
        this.password = "";
        let chars = this.characterers;

        if (this.checkUpperCase) {
            chars += this.characterers.toUpperCase();
        }

        if (this.checkNumbers) {
            chars += this.numbers;
        }

        if (this.checkSymbols) {
            chars += this.symbols;
        }

        for (let i = 0; i < this.value; i++) {
            chars = this.shuffle(chars);
            this.password += this.extract(chars);
        }

        this.checkForConstraint(true, this.characterers);
        this.checkForConstraint(this.checkUpperCase, this.characterers.toUpperCase());
        this.checkForConstraint(this.checkNumbers, this.numbers);
        this.checkForConstraint(this.checkSymbols, this.symbols);

        this.strength = Math.log2(Math.pow(chars.length, this.value)) - Math.log2(Math.pow(this.characterers.length, this.min));

        if (this.strength < 20) {
            this.strengthLabel = StrengthEnum.VERY_WEAK;
        } else if (this.strength < 40) {
            this.strengthLabel = StrengthEnum.WEAK;
        } else if (this.strength < 60) {
            this.strengthLabel = StrengthEnum.MODERATE;
        } else if (this.strength < 80) {
            this.strengthLabel = StrengthEnum.STRONG;
        } else {
            this.strengthLabel = StrengthEnum.VERY_STRONG;
        }
    }

    public copy(): void {
        this.snackBarService.info(this.translate.instant("PASSWORD_GENERATOR.COPY"));
    }

    public toggleChange(type: string, value: boolean): void {
        switch (type) {
            case "upper": this.checkUpperCase = value; break;
            case "numbers": this.checkNumbers = value; break;
            case "symbols": this.checkSymbols = value; break;
        }

        this.generate();
    }

    private shuffle(chars: string): string {
        return chars.split('').sort(function () { return 0.5 - Math.random() }).join('');
    }

    private extract(chars: string): string {
        return chars.split('')[Math.floor(Math.random() * chars.length)];
    }

    private checkForConstraint(check: boolean, constraint: string): void {
        if (check) {
            let exists = false;
    
            for (let char of constraint) {
                if (this.password.indexOf(char) != -1) {
                    exists = true;
                    break;
                }
            }

            if (!exists) {
                let countLowerCase = 0, countUpperCase = 0, countNumbers = 0, countSymbols = 0;

                for (let char of this.password) {
                    if (this.characterers.indexOf(char) != -1) {
                        countLowerCase++;
                    } else if (this.characterers.toUpperCase().indexOf(char) != -1) {
                        countUpperCase++;
                    } else if (this.numbers.indexOf(char) != -1) {
                        countNumbers++;
                    } else if (this.symbols.indexOf(char) != -1) {
                        countSymbols++;
                    }
                }

                let sequence;

                if (countLowerCase >= countUpperCase && countLowerCase >= countNumbers && countLowerCase >= countSymbols) {
                    sequence = this.characterers;
                } else if (countUpperCase >= countLowerCase && countUpperCase >= countNumbers && countUpperCase >= countSymbols) {
                    sequence = this.characterers.toUpperCase();
                } else if (countNumbers >= countLowerCase && countNumbers >= countUpperCase && countNumbers >= countSymbols) {
                    sequence = this.numbers;
                } else {
                    sequence = this.symbols;
                }

                sequence = this.shuffle(sequence);

                for (let char of sequence) {
                    if (this.password.indexOf(char) != -1) {
                        this.password = this.password.replace(char, this.extract(constraint));
                        break;
                    }
                }
            }
        }
    }
}
