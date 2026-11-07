/** Direction-aware arrows: they flip in right-to-left languages. */
export function BackArrow() {
  return (<><span aria-hidden className="rtl:hidden">←</span><span aria-hidden className="hidden rtl:inline">→</span></>);
}
export function ForwardArrow() {
  return (<><span aria-hidden className="rtl:hidden">→</span><span aria-hidden className="hidden rtl:inline">←</span></>);
}
