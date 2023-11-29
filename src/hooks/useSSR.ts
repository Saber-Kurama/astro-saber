// todo: 应该是一个方法吧
function useSSR() {
  const isDOM =
    typeof window !== 'undefined' &&
    window.document &&
    window.document.documentElement

  return {
    isBrowser: isDOM,
    isServer: !isDOM,
  }
}

export default useSSR;