import { shallow } from 'enzyme';
import SelectStartTime from '../selectStartTime';

it('renders the SelectStartTime component', () => {
    const wrapper = shallow(<SelectStartTime />);    
    expect(wrapper).toContainExactlyOneMatchingElement('ThemeProvider');
    expect(wrapper).toContainExactlyOneMatchingElement('MuiPickersUtilsProvider');
    expect(wrapper).toContainExactlyOneMatchingElement('PickerWithState');
});