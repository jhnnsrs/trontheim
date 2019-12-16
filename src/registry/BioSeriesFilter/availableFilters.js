
export const filters = {
    EndsWith:  {
        name: "Name Ends With",
        filterFunc: (items, settings) => {

            let item = items.filter(item => item.data.name.endsWith(settings.stringfield)).shift()

            return item
        }
    },
    DoesntEndWith:  {
        name: "Name Doesnt End With",
        filterFunc: (items, settings) => {

            let item = items.filter(item => !item.data.name.endsWith(settings.stringfield)).shift()

            return item
        }
    }
}
