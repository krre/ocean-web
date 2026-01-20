export const load = ({ locals }) => {
    console.log("locals", locals)
    return {
        session: locals.session,
    };
};
