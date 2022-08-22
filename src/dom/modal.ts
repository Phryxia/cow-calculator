import classNames from 'classnames'

const $modal = document.createElement('div')

$modal.className = 'modal'
document.body.appendChild($modal)

export function openToast(contents: string, isWarning?: boolean): void {
  $modal.innerText = contents
  $modal.className = classNames('modal', 'open', { red: isWarning })
  $modal.addEventListener('transitionend', () => {
    $modal.className = classNames('modal', { red: isWarning })
  })
}
