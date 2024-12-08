import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import { ContextMenu } from '../../../../ui/context-menu';
import { useInputImages } from '../../../../../store/input-images';
import { useApp } from '../../../../../store/app';

export function ChangeOrder() {
    const api = useInputImages(state => state.api);
    const selectedItems = useApp(state => state.selectedItems);

    function handleMoveBackward() {
        api.shiftOrderByIds(
            selectedItems.map(i => i.id),
            -1
        );
    }

    function handleMoveForward() {
        api.shiftOrderByIds(
            selectedItems.map(i => i.id),
            1
        );
    }

    return (
        <>
            <ContextMenu.Item
                label="Move backward in order"
                icon={MdArrowBack}
                onClick={handleMoveBackward}
            />
            <ContextMenu.Item
                label="Move forward in order"
                icon={MdArrowForward}
                onClick={handleMoveForward}
            />
        </>
    );
}
