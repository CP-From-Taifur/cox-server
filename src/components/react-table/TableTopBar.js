import { useContext } from 'react';
import { reactTableContext } from './Table';
import TableSettings from './table-settings/TableSettings';
import TableGlobalSearch from './TableGlobalSearch';

function TableTopBar() {
    const { tableTitle, tableSubTitle, disableGlobalSearch, disableSetting } =
        useContext(reactTableContext);
    return (
        <div className='_s_table_topbar'>
            {/* Table Title and Subtitle ----Start---- */}
            <div>
                {tableTitle && <h3 className='_s_table_title'>{tableTitle}</h3>}
                {tableSubTitle && <p className='_s_table_subtitle'>{tableSubTitle}</p>}
            </div>
            {/* Table Title and Subtitle ----Starend---- */}
            {/* Table Global Search and Setting Modal Toggle Button ----Start---- */}
            <div className='_s_topbar_global_search_and_table_setting_wrapper' style={{
                ...(disableGlobalSearch ? { height: 'auto' } : {})
            }} >
                <TableGlobalSearch />
                {!disableSetting && <TableSettings />}
            </div>
            {/* Table Global Search and Setting Modal Toggle Button ----End---- */}
        </div>
    );
}

export default TableTopBar;
