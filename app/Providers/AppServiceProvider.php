<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::define('use-simulacros', function($user){
            return \App\Support\Subscriptions::canUseSimulacro($user->id);
        });
        Gate::define('use-adaptive', function($user){
            return \App\Support\Subscriptions::isSubscriber($user->id);
        });

    }
}
