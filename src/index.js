/**
 * Lite.js development (main code): <litehappydev@gmail.com>
 */


function Lite(canvas, options){
   const $canvas = document.querySelector(canvas)
   
   if (!$canvas) {
      console.error(`[0] Node Error: unrecognized html node selector: - "${canvas}"`)
      return
   }

   // Технический базовый объект характеристик
   function _baseProp(config){
      // Свойства, которые меняются вместе со стилями css
      const cssPropSize = [
         'width',
         'height',
         'left',
         'top',
      ]

      return {
         width: config.width,
         height: config.height,
         get(prop){
            return this[prop]
         },
         set(prop, newValue){
            this[prop] = newValue

            for (let p of cssPropSize){
               if (prop === p){
                  this.el.style[prop] = newValue + 'px'
                  break
               }
            }

            return newValue
         }
      }
   }
   // Свойства canvas
   const _canvasProp = {
      ..._baseProp({
         width: 50,
         height: 20,
      }),
      el: $canvas,
      cell: 20,
   }

   // объект heroes
   const _heroesList = {}

   return {
      // Свойства canvas
      canvas: _canvasProp,
      // Массив heroes
      heroesList: _heroesList,
      // Инициализация движка (обязательный для запуска)
      init(){
         // Определение ширины canvas
         const canvasWidth = this.canvas.set('width', options?.canvas?.width * this.canvas.cell || this.canvas.get('width') * this.canvas.cell)
         // Определение высоты canvas
         const canvasHeight = this.canvas.set('height', options?.canvas?.height * this.canvas.cell || this.canvas.get('height') * this.canvas.cell)
         // Определение площади canvas
         const canvasArea = this.canvas.set('area', (canvasWidth / this.canvas.get('cell')) * (canvasHeight / this.canvas.get('cell')))
         // Добавление класса инициализации canvas
         $canvas.classList.add('canvas-initialized')
      },
      // Функция работы с клавиатурой
      keyBoardAction(callback){
         // Характеристики события клавиатуры
         const keyBoardProp = {
            key: null,
            event: null,
            repeat: null,
         }
         // Массив событий клавиатуры
         const eventNames = [
            'keydown',
            'keyup'
         ]
         // Функция генерации событий
         function _createEvent(){
            eventNames.forEach(event => {
               document.addEventListener(event, e => {
                  keyBoardProp.key = e.key
                  keyBoardProp.event = e.type
                  keyBoardProp.repeat = e.repeat
                  
                  if (callback){
                     callback(keyBoardProp)
                  }
               })
            })
         }

         _createEvent()
      },
      // Функция создания hero
      createHero(name, config){
         if (!name){
            console.error(`[1] Params Error: no required parameter: - "name"`)
            return
         }
         // Определение свойств hero
         _heroesList[name] = {
            ..._baseProp({
               width: this.canvas.cell,
               height: this.canvas.cell,
            }),
            el: null,
            myltiplySize: 1,
            top: 0,
            left: 0,
         }
         // Функция создания hero (create node element)
         function _createHeroNode(params){
            const node = document.createElement('div')
            node.classList.add('hero')
            node.classList.add(params.class)
            $canvas.appendChild(node)
         }
         // Вызов создание hero
         _createHeroNode({
            class: config?.class || ''
         })
         // Добавление свойства el
         _heroesList[name].el = $canvas.querySelector('.hero')
         // Копия текущего hero (для удобства)
         const currentHero = _heroesList[name]
         // Определение ширины hero
         const heroWidth = currentHero.set('width', config?.myltiplySize * this.canvas.cell || currentHero.get('width'))
         // Определение высоты hero
         const heroHeight = currentHero.set('height', config?.myltiplySize * this.canvas.cell || currentHero.get('height'))
         // Определение координаты x
         const positionY = currentHero.set('left', config?.position?.x * this.canvas.cell || currentHero.get('left') * this.canvas.cell)
         // Определение координаты y
         const positionX = currentHero.set('top', config?.position?.y * this.canvas.cell || currentHero.get('top') * this.canvas.cell)
      },
   }
}

function Development(instanse, options){
   if (!instanse){
      console.error(`[1] Params Error: no required parameter: - "instance"`)
      return
   }
   // Объект canvas, взят из instanse
   const canvas = instanse.canvas
   
   return {
      // Создание сетки для canvas
      createGrid(){
         canvas.el.classList.add('grid')

         for (let i=0; i<canvas.get('area'); i++){
            canvas.get('el').insertAdjacentHTML('beforeend', `
               <div class="grid-cell" style="width: ${canvas.get('cell')}px;height: ${canvas.get('cell')}px;"></div>
            `)
         }
      }
   }
}