import figlet from "figlet";
import colors from "colors";

export default class ConsoleCosmeticLib {

    public static async startUpSequence(after: () => void) {
        figlet.text('ClubLink', {
            font: 'Larry 3D',
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 120,
            whitespaceBreak: true
        }, async (err, data) =>  {
            await console.log(colors.blue(data as string));
            console.log(colors.cyan("Developed by hanatic | Running version " + require("../../package.json").version + "\n"));
            console.log(colors.red("Please note that we are not responsible for your actions regarding this code. Any broken rules or modified code cannot be our responsibility."));
            after();
        });
    }

}
