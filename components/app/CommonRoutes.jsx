import { CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import YemotSimulator from '@shared/components/views/YemotSimulator';
import Tutorial from '@shared/components/views/Tutorial';
import PageList from '@shared/components/views/PageList';
import Roadmap from '@shared/components/views/Roadmap';
import { RegisterPage } from '@shared/components/layout/RegisterPage';
import { MaintenancePage } from '@shared/components/layout/MaintenancePage';
import { isAdmin } from '@shared/utils/permissionsUtil';

/**
 * Renders the set of routes that are identical across all NRA apps:
 *   - /yemot-simulator, /tutorial, /pages-view, /roadmap  (admin layout)
 *   - /register, /maintenance                              (no layout)
 *   - /settings                                           (non-admin only, when settingsPage is given)
 *
 * Props:
 *  - permissions     {*}         React-Admin permissions object
 *  - roadmapFeatures {Array}     Features list passed to <Roadmap>
 *  - settingsPage    {ReactNode} Settings component instance; omit to skip the /settings route
 *  - extraRoutes     {ReactNode} Additional <Route> elements to place inside the main CustomRoutes block
 */
const CommonRoutes = ({ permissions, roadmapFeatures, settingsPage, extraRoutes }) => (
    <>
        <CustomRoutes>
            <Route path="/yemot-simulator" element={<YemotSimulator />} />
            <Route path="/tutorial" element={<Tutorial />} />
            <Route path="/pages-view" element={<PageList />} />
            <Route path="/roadmap" element={<Roadmap features={roadmapFeatures} />} />
            {extraRoutes}
        </CustomRoutes>

        <CustomRoutes noLayout>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
        </CustomRoutes>

        {settingsPage && !isAdmin(permissions) && (
            <CustomRoutes>
                <Route path="/settings" element={settingsPage} />
            </CustomRoutes>
        )}
    </>
);

export default CommonRoutes;
