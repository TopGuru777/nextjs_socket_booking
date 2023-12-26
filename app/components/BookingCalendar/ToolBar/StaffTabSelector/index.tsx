import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useState } from 'react';
import useStaffStore from '@/app/store';


const StaffTabSelector = () => {
  const { currentStaff, setCurrentStaff, staffList } = useStaffStore(
    (state) => state
  );

  const handleSelect = (index: number) => {
    setCurrentStaff(staffList[index]);
  }
  return (
    <div className='max-h-[1em]'>
      <Tabs selectedIndex={Math.max(staffList.indexOf(currentStaff), 0)} onSelect={handleSelect}>
        <TabList>
          {staffList.map((staff: any) => <Tab key={staff.staff_id}>{staff.staff_name}</Tab>)}
        </TabList>

        {staffList.map((staff: any) => <TabPanel key={staff.staff_id}></TabPanel>)}
      </Tabs>
    </div>
  );
}

export default StaffTabSelector;