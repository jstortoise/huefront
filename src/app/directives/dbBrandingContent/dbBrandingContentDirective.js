angular.module('app').directive('brandingcontent', [
	'$timeout', 'dashboardRepository', 'searchMenuRepository',function (timeout, dashboardRepository,searchMenuRepository) {
		function link(scope, element, attrs) {
			scope.page = 1;
			scope.data = [];
			scope.showCollection = false;
			scope.showImageDetails = false
			scope.imageDetailsData = null;
			window.scr = scope
			scope.collectionDataList = [];
			scope.toggleImageDetails = function () {
				scope.showImageDetails = scope.showImageDetails ? false : true;
			};

			scope.imageClickHandler = function(index) {
				var imagedata = scope.companies[index];
				var data = {
					index: index,
					data: []
				};
				imagedata.image_src = "http://huestorage.s3.amazonaws.com/" + imagedata.logo_url;
				imagedata.index = index;
				// calc by page num
				data.index = scope.page_num * scope.page_limit + index;
				scope.imageDetailsData = imagedata;
				scope.toggleImageDetails();

				scope.companytitle = scope.companies[index].company_title;
				console.log(scope.companytitle);
			};
			
			scope.range = function(index,value)
			{
				var input = [];
				for(i = index;i<= value;i++)
				{
					input.push(i);
				}

				return input;
			}

			scope.back = function()
			{
				var page = scope.paginate.current_page;
				if(page > 1)
				{
					scope.selectpage(page - 1);
				}
			}

			scope.next = function()
			{
				var page = scope.paginate.current_page;
				if(page < scope.paginate.total_pages)
				{
					scope.selectpage(page + 1);
				}	
			}	

			scope.selectpage = function(item)
			{
				searchMenuRepository.getControlsDataBrandingBind(scope.control, scope.industryid, { page: item, per_page: 15 }).then(function(res){
					scope.companies = res.logo_colors;
					scope.paginate = res.paginate;
				})
			}
		}

		return {
			restrict: 'E',
			templateUrl: 'app/directives/dbBrandingContent/dbBrandingContentView.html',
			link: link,
			scope: {
				originalData: '=data',
				companies:"=",
				chart:"=",
				title:"=",
				paginate:"=",
				industryid:"=",
				control:"="
			}
		};
	}
]);
