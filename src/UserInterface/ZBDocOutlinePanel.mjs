import { DOMOps } from "./DOMOps.mjs";
import { ZBMenuSection } from "./ZBMenuSection.mjs";

const ZBDocOutlinePanel = function(_parentDOMElement) {
    const docOutlinePanelDOMEl = DOMOps.appendHTML(_parentDOMElement, `<menu class="zb-current-doc-outline"></menu>`, true);

    const primarySection = new ZBMenuSection(null, docOutlinePanelDOMEl);
    primarySection.expandSection();

    let currentParentSlug = "";
    let insersectionObserver = null;

    const outlineVisibilityMap = new Map();

    const generateOutlineVisibilityMap = function(_outline, _parentSlug) {
        for(let i=0; i<_outline.length; i++) {            
            outlineVisibilityMap.set(_outline[i].anchorFragmentId, false);

            if(_outline[i].subTopics.length > 0) {
                generateOutlineVisibilityMap(_outline[i].subTopics, _parentSlug);
            }
        }
    };

    const loadOutlineAsMenuItems = function(_outline, _menuSection, _parentSlug) {
        for(let i=0; i<_outline.length; i++) {
            _menuSection.addMenuItem(_outline[i].title, `${_parentSlug}?h=${_outline[i].anchorFragmentId}`);

            if(_outline[i].subTopics.length > 0) {
                const subSec = _menuSection.addMenuSection("");
                loadOutlineAsMenuItems(_outline[i].subTopics, subSec, _parentSlug);
                subSec.expandSection();
            }
        }
    };

    /**
     * 
     * @returns {Boolean}
     */
    const hasAtLeastOneVisibleSectionInOutlineVisibilityMap = function() {
        for (const [headSlug, isVisible] of outlineVisibilityMap) {
            if(isVisible) {
                return true;
            }
        }

        return false;
    };

    const onHeaderIntersect = function(e) {
        for(let i=0; i<e.length; i++) {
            // By convention slug <=> ID
            const headingSlug = e[i].target.getAttribute('id');
            if(e[i].isIntersecting) {
                outlineVisibilityMap.set(headingSlug, true);
            } else {
                outlineVisibilityMap.set(headingSlug, false);
            }
        }

        if(hasAtLeastOneVisibleSectionInOutlineVisibilityMap()) { // don't update if we enter an area where no headers are visible
            primarySection.deactivateAllMenuItems();

            for (const [headSlug, isVisible] of outlineVisibilityMap) {
                if(isVisible) {
                    primarySection.activateMenuItem(`${currentParentSlug}?h=${headSlug}`, false);
                    break;
                }
            }
        }
    };

    /**
     * 
     * @param {Object[]} _outline 
     * @param {String} _parentSlug
     */
    this.render = function(_outline, _parentSlug) {
        primarySection.clearSubMenuItems();
        loadOutlineAsMenuItems(_outline, primarySection, _parentSlug);
        generateOutlineVisibilityMap(_outline, _parentSlug);

        currentParentSlug = _parentSlug;

        insersectionObserver = new IntersectionObserver(
            onHeaderIntersect,
            {
                root: null,
                rootMargin: "20px", // figure out how to pull this dynamically
                threshold: 0.5,
            }
        );

        const headerDOMEls = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headerDOMEls.forEach((_el) => {
            insersectionObserver.observe(_el);
        });
    };
};

export { ZBDocOutlinePanel }
