// Render dynamic chat turns into conversation timeline with Plus Jakarta Sans font
export function appendChatTurn(containerElement: HTMLDivElement, speakerName: string, messageText: string, isUserTurn: boolean): void {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = isUserTurn ? 'flex justify-end my-3' : 'flex justify-start my-3';

  const bubbleDiv = document.createElement('div');
  bubbleDiv.className = isUserTurn
    ? 'bg-[#cc785c] text-white rounded-2xl rounded-tr-none px-5 py-3.5 text-sm max-w-[85%] shadow-md leading-relaxed font-sans font-normal'
    : 'bg-[#181715] text-[#faf9f5] border border-slate-800/80 rounded-2xl rounded-tl-none p-5 text-sm max-w-[95%] space-y-2 shadow-xl font-sans';

  if (!isUserTurn) {
    const labelSpan = document.createElement('span');
    labelSpan.className = 'text-[11px] text-[#cc785c] font-semibold block tracking-widest uppercase mb-1';
    labelSpan.textContent = speakerName.toUpperCase();
    bubbleDiv.appendChild(labelSpan);
  }

  const textParagraph = document.createElement('p');
  textParagraph.className = 'leading-relaxed text-sm md:text-base font-normal text-[#faf9f5]';
  textParagraph.textContent = messageText;
  bubbleDiv.appendChild(textParagraph);

  wrapperDiv.appendChild(bubbleDiv);
  containerElement.appendChild(wrapperDiv);

  // Auto scroll timeline container
  const parentTimeline = containerElement.parentElement;
  if (parentTimeline) {
    parentTimeline.scrollTop = parentTimeline.scrollHeight;
  }
}
