import {fireEvent, waitFor} from '@testing-library/react-native';
import {render} from '../src/app/utils/TestUtils';
import React from 'react';
import AccordionList from '../src/app/components/common/AccordionList';

describe('Accordion list component', () => {

    it('renders correctly', async () => {
        const {toJSON} = await waitFor(() =>
            render(<AccordionList name={"TestList"} listItems={[]} openByDefault={false}/>)
        );
        expect(toJSON()).toMatchSnapshot();
    });

    it('should render list title', async () => {
        const {queryByText} = await waitFor(() =>
            render(<AccordionList name={"TestList"} listItems={[]} openByDefault={false}/>)
        );
        const title = await queryByText("TestList");
        expect(title).toBeTruthy();
    });

    it('should not render list items if list is not open', async () => {
        const {queryByTestId} = await waitFor(() =>
            render(<AccordionList name={"TestList"} listItems={[]} openByDefault={false}/>)
        );
        const content = await queryByTestId("listContent");
        expect(content).toBeFalsy();
    });

    it('should render list items if list is open', async () => {
        const {queryByTestId} = await waitFor(() =>
            render(<AccordionList name={"TestList"} listItems={[]} openByDefault={false}/>)
        );
        const toggle = await queryByTestId("toggleButton");
        fireEvent.press(toggle);
        const content = await queryByTestId("listContent");
        expect(content).toBeTruthy();
    });

});
