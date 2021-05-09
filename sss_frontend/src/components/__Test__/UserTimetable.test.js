import { shallow } from 'enzyme';
import UserTimetable from '../UserTimetable';

it('renders the UserTimetable component', () => {
    const wrapper = shallow(<UserTimetable />);    
    expect(wrapper).toContainExactlyOneMatchingElement('UserTimetableContextProvider');
    expect(wrapper).toContainExactlyOneMatchingElement('UserTimetableLayout');
});