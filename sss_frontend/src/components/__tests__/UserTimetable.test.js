import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import SelectStartTime from '../selectStartTime';

it('renders the UserTimetable component', () => {

    const wrapper = shallow(<SelectStartTime />);

    // Expect the Page to contain the given heading, along with exactly one Sidebar and Main component.
    
    expect(wrapper).toContainExactlyOneMatchingElement('ThemeProvider');


});