import { useRecoilValue } from 'recoil';

import { ActionMenuComponentInstanceContext } from '@/action-menu/states/contexts/ActionMenuComponentInstanceContext';
import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { RecordFilterGroupsComponentInstanceContext } from '@/object-record/record-filter-group/states/context/RecordFilterGroupsComponentInstanceContext';
import { RecordFiltersComponentInstanceContext } from '@/object-record/record-filter/states/context/RecordFiltersComponentInstanceContext';
import { RIGHT_DRAWER_RECORD_INSTANCE_ID } from '@/object-record/record-right-drawer/constants/RightDrawerRecordInstanceId';
import { isNewViewableRecordLoadingState } from '@/object-record/record-right-drawer/states/isNewViewableRecordLoading';
import { viewableRecordIdState } from '@/object-record/record-right-drawer/states/viewableRecordIdState';
import { viewableRecordNameSingularState } from '@/object-record/record-right-drawer/states/viewableRecordNameSingularState';
import { RecordShowContainer } from '@/object-record/record-show/components/RecordShowContainer';
import { useRecordShowPage } from '@/object-record/record-show/hooks/useRecordShowPage';
import { RecordSortsComponentInstanceContext } from '@/object-record/record-sort/states/context/RecordSortsComponentInstanceContext';
import { RecordValueSetterEffect } from '@/object-record/record-store/components/RecordValueSetterEffect';
import { RecordFieldValueSelectorContextProvider } from '@/object-record/record-store/contexts/RecordFieldValueSelectorContext';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import styled from '@emotion/styled';

const StyledRightDrawerRecord = styled.div<{ isMobile: boolean }>`
  height: ${({ theme, isMobile }) =>
    isMobile ? `calc(100% - ${theme.spacing(16)})` : '100%'};
`;

export const RightDrawerRecord = () => {
  const isMobile = useIsMobile();

  const viewableRecordNameSingular = useRecoilValue(
    viewableRecordNameSingularState,
  );
  const isNewViewableRecordLoading = useRecoilValue(
    isNewViewableRecordLoadingState,
  );
  const viewableRecordId = useRecoilValue(viewableRecordIdState);

  if (!viewableRecordNameSingular && !isNewViewableRecordLoading) {
    throw new Error(`Object name is not defined`);
  }

  const { objectNameSingular, objectRecordId } = useRecordShowPage(
    viewableRecordNameSingular ?? '',
    viewableRecordId ?? '',
  );

  return (
    <RecordFilterGroupsComponentInstanceContext.Provider
      value={{ instanceId: `record-show-${objectRecordId}` }}
    >
      <RecordFiltersComponentInstanceContext.Provider
        value={{ instanceId: `record-show-${objectRecordId}` }}
      >
        <RecordSortsComponentInstanceContext.Provider
          value={{ instanceId: `record-show-${objectRecordId}` }}
        >
          <ContextStoreComponentInstanceContext.Provider
            value={{
              instanceId: RIGHT_DRAWER_RECORD_INSTANCE_ID,
            }}
          >
            <ActionMenuComponentInstanceContext.Provider
              value={{ instanceId: RIGHT_DRAWER_RECORD_INSTANCE_ID }}
            >
              <StyledRightDrawerRecord isMobile={isMobile}>
                <RecordFieldValueSelectorContextProvider>
                  {!isNewViewableRecordLoading && (
                    <RecordValueSetterEffect recordId={objectRecordId} />
                  )}
                  <RecordShowContainer
                    objectNameSingular={objectNameSingular}
                    objectRecordId={objectRecordId}
                    loading={false}
                    isInRightDrawer={true}
                    isNewRightDrawerItemLoading={isNewViewableRecordLoading}
                  />
                </RecordFieldValueSelectorContextProvider>
              </StyledRightDrawerRecord>
            </ActionMenuComponentInstanceContext.Provider>
          </ContextStoreComponentInstanceContext.Provider>
        </RecordSortsComponentInstanceContext.Provider>
      </RecordFiltersComponentInstanceContext.Provider>
    </RecordFilterGroupsComponentInstanceContext.Provider>
  );
};
