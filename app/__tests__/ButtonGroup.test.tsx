import React from 'react';
import {fireEvent, waitFor} from '@testing-library/react-native';
import {render} from '../src/app/utils/TestUtils';
import ButtonGroup, {IGroupButton} from '../src/app/components/common/ButtonGroup';

describe('Button group component', () => {

    const mockOptions: IGroupButton[] = [
        {value: 1, viewValue: 'FIRST_VALUE'},
        {value: 2, viewValue: 'SECOND_VALUE'}
    ];
    const onSelected = jest.fn();

    it('renders correctly', async () => {
        const {toJSON} = await waitFor(() =>
            render(<ButtonGroup arrayOptions={mockOptions} onSelect={onSelected} initialValue={mockOptions[0].value} />)
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('should not call onSelect after button press if value does not change', async () => {
        const {getByTestId} = await waitFor(() =>
            render(<ButtonGroup arrayOptions={mockOptions} onSelect={onSelected} initialValue={mockOptions[0].value} />)
        );
        const sameValue = mockOptions[0].value;
        const button = getByTestId(`Button${sameValue}`);
        fireEvent.press(button);
        expect(onSelected).not.toHaveBeenCalled();
    });

    it('should call onSelect after button press', async () => {
        const {getByTestId} = await waitFor(() =>
            render(<ButtonGroup arrayOptions={mockOptions} onSelect={onSelected} initialValue={mockOptions[0].value} />)
        );
        const newValue = mockOptions[1].value;
        const button = getByTestId(`Button${newValue}`);
        fireEvent.press(button);
        expect(onSelected).toHaveBeenCalledWith(newValue);
    });

});
