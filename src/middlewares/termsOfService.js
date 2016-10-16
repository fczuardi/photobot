import setup from '../../setup';

// TODO: change this to remote database
const activeUsers = new Set();
const tos = (ctx, next) => {
    const fileId = ctx.state.fileId;

    const { text, from } = ctx.update.message;

    const isStart = text && text === '/start';
    const isTosReply = text && (text === setup.agreeText || text === setup.declineText);
    const hasAccepted = activeUsers.has(from.id);

    if (isStart && !hasAccepted) {
        ctx.reply(setup.askForConfirmation, { reply_markup: {
            resize_keyboard: true,
            one_time_keyboard: true,
            keyboard: [
                [{ text: setup.agreeText }, { text: setup.declineText }]]
        } });
    } else if (isTosReply && !hasAccepted) {
        if (text === setup.agreeText) {
            activeUsers.add(from.id);
            ctx.reply(setup.notifyAgreed);
        } else {
            ctx.reply(setup.notifyDeclined);
        }
    } else if (fileId && !hasAccepted) {
        ctx.reply(setup.greeting(
                    from.first_name,
                    process.env.BOT_USERNAME));
    }
    return next();
};
export default tos;

