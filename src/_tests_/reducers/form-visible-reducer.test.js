import formVisibleReducer from '../../reducers/form-visible-reducer';

describe("formVisibleReducer", () => {
    test('Should return default state if no action type recognized', () => {
        expect(formVisibleReducer(false, { type: null })).toEqual(false);
    });

    test('Should toggle form visibility state to true', () => {
        expect(formVisibleReducer(false, { type: ""}))
    })
})