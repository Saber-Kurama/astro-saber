import { createContext, forwardRef, useReducer } from "react";
import { useSpring, animated } from "@react-spring/web";
import useWindowScrollInfo from "@/hooks/useWindowsScrollInfo";
import { twMerge } from "tailwind-merge";

enum ActionTypes {
  setCollapseOpen,
  setCollapseNode,
}

type Action =
  | { type: ActionTypes.setCollapseOpen; open: boolean }
  | { type: ActionTypes.setCollapseNode; node: React.ReactNode };

type States = {
  open: boolean;
  node: React.ReactNode;
};

const initialStates: States = {
  open: false,
  node: null,
};

function collapseReducer(states = initialStates, action: Action) {
  switch (action.type) {
    case ActionTypes.setCollapseOpen:
      return {
        ...states,
        open: action.open,
      };
    case ActionTypes.setCollapseNode:
      return {
        ...states,
        node: action.node,
      };
    default:
      throw new Error("Unrecognized action type");
  }
}

const CollapseStoreContext = createContext<States | null>(null);
const CollapseDispatchContext = createContext<React.Dispatch<Action> | null>(
  null
);

export interface NavbarProps
  extends React.PropsWithChildren<React.ComponentPropsWithoutRef<"nav">> {
  position?: "floating" | "static" | "sticky";
  show?: boolean;
  hideOnScroll?: boolean;
  transparentOnTop?: boolean;
  onShowChange?: (isShow: boolean) => void;
}

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      position = "sticky",
      show,
      hideOnScroll = false,
      transparentOnTop = false,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const { direction, isTop } = useWindowScrollInfo();
    const shouldHide =
      position !== "static" && hideOnScroll && direction.vertical === "down";
    const isShow = show ?? !shouldHide;
    const [states, dispatch] = useReducer(collapseReducer, initialStates);
    const shouldTransparent = transparentOnTop && isTop;

    const [translateSpring] = useSpring(
      () => ({
        to: {
          transform: isShow ? "translateY(0%)" : "translateY(-100%)",
        },
        config: {
          tension: 300,
          friction: 30,
        },
      }),
      [isShow]
    );
    return (
      <>
        {position === "floating" && <div className="pb-[3.75rem]"></div>}
        <animated.nav
          ref={ref}
          className={twMerge(
            position === "floating" ? "fixed top-0 left-0" : null,
            position === "static" ? "static" : null,
            position === "sticky" ? "sticky top-0 left-0" : null,
            "w-full h-[3.75rem] z-50",
            // 'transition-transform duration-300',
            // !isShow ? '-translate-y-full' : null,
            className
          )}
        >
          <CollapseStoreContext.Provider value={states}>
            <CollapseDispatchContext.Provider value={dispatch}>
              <div
                className={twMerge(
                  isShow ? "shadow-md border-b" : "shadow-none border-b-0",
                  "shadow-gray-900/[0.05] dark:shadow-gray-900/50 border-gray-600/20 dark:border-gray-50/[0.06]",
                  "bg-white/80 dark:bg-gray-800/75",
                  "backdrop-blur-md backdrop-saturate-150",
                  "transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300",
                  shouldTransparent &&
                    "!bg-transparent !border-transparent backdrop-blur-0 backdrop-saturate-100 !shadow-none"
                )}
              >
                <div className="flex h-[3.75rem]">{children}</div>
                {/* {states.node && (
                <animated.div style={collapseSpring} className='overflow-hidden'>
                  <div ref={collapseContentRef}>
                    {states.node}
                  </div>
                </animated.div>
              )} */}
              </div>
            </CollapseDispatchContext.Provider>
          </CollapseStoreContext.Provider>
        </animated.nav>
      </>
    );
  }
);

export default Object.assign(Navbar, {
  // Content: NavbarContent,
  // Item: NavbarItem,
  // Logo: NavbarLogo,
  // Collapse: NavbarCollapse,
  // Trigger: NavbarCollapseTrigger,
});
