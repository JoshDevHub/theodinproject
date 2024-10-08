import { Controller } from '@hotwired/stimulus'

export default class LessonTocController extends Controller {
  static targets = ['toc', 'lessonContent']

  static values = {
    itemClasses: String
  }

  connect () {
    this.buildTocItems()

    this.observer = new window.IntersectionObserver(
      this.activeSection.bind(this),
      { rootMargin: '-15% 0px -80% 0px' }
    )

    this.lessonContentTarget.querySelectorAll('section[data-title]').forEach((section) => {
      this.observer.observe(section)
    })
  }

  disconnect () {
    this.observer.disconnect()
    this.tocTarget.innerHTML = ''
  }

  activeSection (entries) {
    entries.forEach((entry) => {
      const { title } = entry.target.dataset
      const tocItem = this.tocTarget.querySelector(`li a[href="#${title}"]`)?.parentElement
      if (!tocItem) return

      if (entry.intersectionRatio > 0) {
        tocItem.classList.add('toc-item-active')
      } else {
        tocItem.classList.remove('toc-item-active')
      }
    })
  }

  buildTocItems () {
    this.headings().forEach((heading) => {
      this.tocTarget.insertAdjacentHTML('beforeend', this.tocItem(heading))
    })
  }

  headings () {
    return (
      Array
        .from(this.lessonContentTarget.querySelectorAll('section > h3'))
        .map((heading) => heading)
        .filter((heading) => heading.innerText)
    )
  }

  tocItem (heading) {
    const id = heading.firstChild.getAttribute('href')

    return `<li class="p-2 pl-4"><a class="${this.itemClassesValue}" href="${id}">${heading.innerText}</a></li>`
  }
}
